import json, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile
SR=48000; cu=json.load(open('cues.json')); F=cu['fps']; DUR=cu['total']/F
N=int(SR*DUR); rng=np.random.default_rng(7)
def add(buf,x,t):
    i=int(t*SR); 
    if i<0: x=x[-i:]; i=0
    j=min(N,i+len(x)); 
    if j>i: buf[i:j]+=x[:j-i]
def filt(x,kind,fc,o=2):
    return sosfilt(butter(o,fc,kind,fs=SR,output='sos'),x)
def tt(d): return np.arange(int(d*SR))/SR
def kick(g=1):
    t=tt(.35); f=45+110*np.exp(-t*30); return g*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def hat(g=.3):
    t=tt(.05); return g*filt(rng.standard_normal(len(t)),'high',7000)*np.exp(-t*80)
def bass(fr,d,g=.5):
    t=tt(d); s=np.sign(np.sin(2*np.pi*fr*t))*.5+np.sin(2*np.pi*fr*t); s=filt(s,'low',380)
    return g*s*np.minimum(1,t*200)*np.exp(-t*3)
def lead(fr,d=.2,g=.12):
    t=tt(d); s=sum(np.sign(np.sin(2*np.pi*fr*(1+dt)*t)) for dt in(-.006,0,.006)); s=filt(s,'low',3200)
    return g*s*np.exp(-t*14)
def impact(g=1,long=1.2):
    t=tt(long); f=70*np.exp(-t*3)+28; b=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3.2)
    n=filt(rng.standard_normal(len(t)),'low',2500)*np.exp(-t*7)*.35
    mt=np.sin(2*np.pi*180*t)*np.exp(-t*14)*.15
    return g*(b*.9+n+mt)
def whoosh(d=.5,g=.4,up=True):
    t=tt(d); n=rng.standard_normal(len(t)); out=np.zeros(len(t)); seg=40
    for k in range(seg):
        a=int(k*len(t)/seg); b=int((k+1)*len(t)/seg); fc=(300+4500*((k/seg)**2 if up else (1-k/seg)**2))
        sos=butter(2,[fc*.7,min(fc*1.4,20000)],'band',fs=SR,output='sos'); out[a:b]=sosfilt(sos,n)[a:b]
    env=np.sin(np.pi*np.linspace(0,1,len(t)))**1.6; return g*out*env*2
def riser(d=1.2,g=.3):
    t=tt(d); f=200+3000*(t/d)**2; s=np.sin(2*np.pi*np.cumsum(f)/SR)*(t/d); n=filt(rng.standard_normal(len(t)),'high',2000)*(t/d)*.4
    return g*(s*.5+n)
def tick(g=.15):
    t=tt(.06); return g*np.sin(2*np.pi*2400*t)*np.exp(-t*60)
L=np.zeros(N)
bpm=124; beat=60/bpm
prog=[55,43.65,48.99,49]  # A F C G (bass hz, octave low)
prog=[110,87.31,130.81,98]
arp=[[220,261.63,329.63],[174.61,220,261.63],[261.63,329.63,392],[196,246.94,293.66]]
sect=[(0,2.8,0),(2.8,SC:=DUR,1)]
t0=0
nb=int(DUR/beat)+1
for b in range(nb):
    t=b*beat
    sec=0 if t<3.0 else (1 if t<12 else 2)
    if t>DUR-1.0: continue
    bar=(b//4)%4
    if sec>=1 or b%2==0: add(L,kick(.9 if sec else .5),t)
    add(L,hat(.25),t+beat/2)
    if sec>=1:
        add(L,hat(.18),t+beat/4); add(L,hat(.18),t+3*beat/4)
        add(L,bass(prog[bar],beat*.9,.45),t+beat/2)
    if sec>=2 or (sec==1 and b%4==0):
        for k in range(4): add(L,lead(arp[bar][k%3]*(2 if k==3 else 1),beat/4*.9,.10 if sec==1 else .13),t+k*beat/4)
# sidechain-ish ducking is baked in via kick; add drone pad
t=tt(DUR); pad=sum(np.sin(2*np.pi*f*t) for f in (110,164.8,220))*.03*np.minimum(1,t/2)
L+=pad
M=L.copy()
M=np.tanh(M*1.3)*.5
# fx
S=np.zeros(N)
for m in cu['impacts']:
    ts=m['f']/F; s=m['s']
    add(S,impact(.35+.4*min(s,1.4),1.3 if s>=1 else .6),ts)
    add(S,tick(.3),ts-.25)
add(S,riser(1.4,.5),40/F-1.4)
for a,b in cu['scenes'][:-1]: add(S,whoosh(.6,.5),b/F-.5)
add(S,riser(1.0,.5),604/F-1.0)
add(S,impact(1.4,2.2),604/F); add(S,whoosh(.8,.5,False),612/F)
# alert dolly whoosh
add(S,whoosh(1.2,.55,True),5/F)
mix=M*.55+S*.8
# fade tail
fd=int(SR*.5); mix[-fd:]*=np.linspace(1,0,fd)
mix/=max(1e-6,np.abs(mix).max())/.89
st=np.stack([mix,np.roll(mix,40)*.98],1)
wavfile.write('work/audio.wav',SR,(st*32767).astype(np.int16)); print('ok',DUR)
