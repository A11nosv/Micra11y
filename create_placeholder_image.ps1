
Add-Type -AssemblyName System.Drawing

$width = 100
$height = 100
$image = New-Object System.Drawing.Bitmap($width, $height)
$graphic = [System.Drawing.Graphics]::FromImage($image)

# Fill with white color
$graphic.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), 0, 0, $width, $height)

$image.Save("src/assets/Microbit/placeholder.png", [System.Drawing.Imaging.ImageFormat]::Png)
