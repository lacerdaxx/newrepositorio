import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Ad} from './Main';
import cues from '../cues.json';
const Root: React.FC = () =>
  React.createElement(Composition, {id: 'Ad', component: Ad, durationInFrames: (cues as any).total, fps: 30, width: 1080, height: 1920});
registerRoot(Root);
