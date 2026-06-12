import React from "react";
import { staticFile } from "remotion";

export const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: "LXGW WenKai"; src: url('${staticFile("fonts/LXGWWenKai-Regular.ttf")}') format("truetype"); font-weight: normal; font-style: normal; }
    @font-face { font-family: "ChakraPetch"; src: url('${staticFile("fonts/ChakraPetch-SemiBold.ttf")}') format("truetype"); font-weight: 600; font-style: normal; }
  `}</style>
);
