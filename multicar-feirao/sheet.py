import sys,glob
from PIL import Image
fs=sorted(glob.glob('work/st/f*.png'))
if len(sys.argv)>1: fs=[f'work/st/f{int(x):04d}.png' for x in sys.argv[1:]]
ims=[Image.open(f) for f in fs]
w,h=ims[0].size; cols=min(len(ims),6); rows=(len(ims)+cols-1)//cols
S=Image.new('RGB',(w*cols,h*rows))
for i,im in enumerate(ims): S.paste(im,((i%cols)*w,(i//cols)*h))
S.save('work/sheet.png'); print(S.size)
