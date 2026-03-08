import { useState } from "react";
import { motion } from "framer-motion";
import demoBefore from "@/assets/demo-before.jpg";
import demoAfter from "@/assets/demo-after.png";

// Second portrait pair — young man, studio shot (Unsplash)
const before2 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&fit=crop&crop=faces";
const after2 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&fit=crop&crop=faces&sat=-80&blend=000000&blend-mode=multiply&balph=55";

// Third portrait pair — woman with coloured background (Unsplash)
const before3 = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80&fit=crop&crop=faces";
const after3 = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80&fit=crop&crop=faces&sat=-100";

type SliderProps = {
  beforeImg: string;
  afterImg: string;
  label: string;
};

const ComparisonSlider = ({ beforeImg, afterImg, label }: SliderProps) => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Fixed uniform aspect ratio for ALL three cards */}
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-md">

        {/* Checkerboard for transparent bg */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-conic-gradient(#1a1a1e 0% 25%, #050505 0% 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* After image */}
        <img
          src={afterImg}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Before image clipped */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImg}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#60a5fa] shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white/20">
            ⟷
          </div>
        </div>

        {/* Slider input */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20 m-0 p-0"
        />

        {/* Labels */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[10px] tracking-wider text-white font-bold z-10 select-none shadow-md">
          BEFORE
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[10px] tracking-wider text-white font-bold z-10 select-none shadow-md">
          AFTER
        </div>
      </div>

      {/* Context Label */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[12px] font-semibold tracking-wide shadow-sm">
          {label}
        </span>
      </div>
    </div>
  );
};

const BeforeAfterSection = () => {

  // Three genuinely different people — all cards uniform size (aspect-[3/4])
  const referenceImages = [
    { id: 1, before: demoBefore, after: demoAfter, label: "Portrait Detail" },
    { id: 2, before: before2, after: after2, label: "Product Isolate" },
    { id: 3, before: before3, after: after3, label: "Complex Edges" },
  ];

  return (
    <section id="see-difference" className="py-32 bg-[#050505] relative overflow-hidden">

      {/* Subtle glow behind the entire section */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            See the Difference
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto font-medium">
            Drag the slider to compare before and after. Our V3.0 Hub intelligently identifies subjects and preserves difficult edges effortlessly.
          </p>
        </motion.div>

        {/* Multiple Reference Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-[1200px] mx-auto items-center">
          {referenceImages.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center"
            >
              <ComparisonSlider
                beforeImg={item.before}
                afterImg={item.after}
                label={item.label}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSection;
