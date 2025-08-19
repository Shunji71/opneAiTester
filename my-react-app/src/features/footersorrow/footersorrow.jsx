import { useLayoutEffect, useRef } from "react";
import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function Footersorrow() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ← CodePenのJSパネルの処理をここに移植
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root}>
      {/* ← CodePenのHTMLをReact化してここへ（className等に調整） */}
    </div>
  );
}