---
layout: post
title:  "From file upload to RCE - PHP"
date:   2020-06-10 08:00:00 +0100
---

This vulnerability was found during testing on [Synack](https://www.synack.com/).

>TL;DR <br>
>Image file upload functionality doesn't validate a file extension but validates Content-type and a content of a file. Application sets Content-type of HTTP response based on a file extension. Image, containing PHP code and a file extension set to .php, was uploaded and allowed remote code execution.

An application had image file upload functionality and was written in PHP. I started testing for [unrestricted file upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload), knowing a good starting point is the OWASP Testing Guide. As always, I read responses from the server, analysed them and got the following information:

- When a file sent to the server is verified against Content-type and file header, only images are allowed
- A file can have any extension you like, extension defines Content-type of HTTP response sent by the server
- The file is transformed by the server
- The file's metadata is cleared (no EXIF data)
- During testing the newest version of ImageMagick was used (disclosed in one of HTTP responses sent by the server)

As you can see, injecting PHP code in EXIF data did not result in immediate exploitability. At that point I started thinking of next possible step. I knew I was looking for RCE.

I reached the following conclusion: `If an uploaded image contains PHP code and that code is not modified, and file extension is one of php, then application should execute the file`. The challenge here is to find a place in an image where PHP code can be placed. Of course, you can read RFC/specifications and it can be useful. However, it may be difficult to apply that knowledge to a real situation as we don't have access to code and we don't know which part of an RFC can be useful. As I knew what I wanted to achieve, I could create some plan. Usually, if the problem is complex, I use a `divide and conquer` approach (like the way algorithm works).

The plan:

1. Define a list of image file formats.
2. Try to identify transformations made to the image by the server.
3. Recreate the situation (transformations) locally using ImageMagick and PHP code to have a local testing capability.
4. Are there any unmodified spaces in the image file?
5. Yes, go to step 6. No, go to step 1.
6. Inject a code to an identified space and test if the injected code is executed.

It can be easily noticed that the plan is just an algorithm.

I started with a .GIF file. To make the identification of changes easier I picked up an [image](/assets/from-file-upload-to-rce-test.gif) with one color (black) and no animation. According to [KISS principle](https://en.wikipedia.org/wiki/KISS_principle).

I identified transformations by uploading the file and downloading the result and comparing them both. Identified transformations are:

- clearing EXIF data
- resizing to 300x300

I wrote a code snippet for locally testing these transformations:

```php
<?php
$thumb = new Imagick('testgif.gif');
$thumb->resizeImage(300,300);
$thumb->writeImage('testgif2.gif');
$thumb->destroy();
?>
```

I identified unmodified space (in my case it was the field of '00' values). That information can be combined with GIF specification. As my payload was small, I started injecting in the middle of available space.

![Testfile](/assets/from-file-upload-to-rce-testfile.png)

I injected the code by modifying hex values in Burp and carved my payload into the GIF image.

![Carving first payload](/assets/from-file-upload-to-rce-carving.png)

Another payload is:

![Carving second payload](/assets/from-file-upload-to-rce-carving2.png)

The payloads used for testing were:

```php
<?php phpinfo();?>
<?php system($_GET['c']);?>
```

That ends the story. The uploaded GIF file with carved PHP code gave me RCE.

![phpinfo](/assets/from-file-upload-to-rce-phpinfo.png)