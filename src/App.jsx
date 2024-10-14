import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function App() {

  const canvasRef = useRef(null)
  const perentRef = useRef(null)
  const imagcount = useRef(0);
  const images = useRef([]);

  const [frame, setFrame] = useState({
    curruntIndex: 1,
    maxIndex: 382,
  });

  useEffect(() => {
    for (let i = 1; i <= frame.maxIndex; i++) {
      const img = new Image();
      img.src =  `./frames/frame_${i.toString().padStart(4, "0")}.jpeg`;
      img.onload = () => (++imagcount.current === frame.maxIndex && loadImage(frame.curruntIndex));
      images.current[i] = img;
      console.log(images);
      
    }
  }, [frame.maxIndex]);



  const loadImage = (index) => {
    const img = images.current[index]
    if(img){

      const canvas = canvasRef.current, context = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const [scaleX, scaleY] = [canvas.width / img.width, canvas.height / img.height];
      const scale = Math.max(scaleX, scaleY);

      const [newWidth, newHeight] = [img.width * scale, img.height * scale];
      const [offsetX, offsetY] = [(canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2];
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

      setFrame((pre) => ({...pre, curruntIndex: index}))
    }
  };

  gsap.registerPlugin(ScrollTrigger)

  useGSAP(function(){
    gsap.timeline({
      scrollTrigger:{
        trigger: perentRef.current,
        start: "top top",
        end:  "bottom bottom",
        markers: true,
        scrub: 2
      }
    }).to(frame,{
      curruntIndex: frame.maxIndex,
      onUpdate: function(){
        loadImage(Math.floor(frame.curruntIndex))
      },
      ease: "none",
    })
  })


  return (
    <main className=" w-full bg-zinc-400">
      <div ref={perentRef}  className=" relative w-full h-[700vh]">
        <div className=" sticky top-0 left-0 w-full h-screen">
          <canvas ref={canvasRef} className="w-full h-full object-cover"></canvas>
        </div>
      </div>

      <div className="w-full h-[60vh] bg-zinc-800 flex items-center justify-center">
        <h1 className="font-sans font-semibold text-white text-4xl">Footer 🔥</h1>
      </div>
    </main>
  );
}
