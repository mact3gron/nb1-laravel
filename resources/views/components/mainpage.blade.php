
<!doctype html>
<html lang="en">
  <head>
    <title>My Website</title>
    <link rel="stylesheet" href="/css/style.css" />
  </head>
  <body>
    <div class="header">
        @include('header')
    </div>
    <div class="content">
        {{ $slot }}
    </div>
  </body>
</html>
