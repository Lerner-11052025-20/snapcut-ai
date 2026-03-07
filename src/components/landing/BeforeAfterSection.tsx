import { useState } from "react";
import { motion } from "framer-motion";
import demoBefore from "@/assets/demo-before.jpg";
import demoAfter from "@/assets/demo-after.png";

const BeforeAfterSection = () => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            See the Difference
          </h2>
          <p className="text-muted-foreground text-lg">
            Drag the slider to compare before and after.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="relative glass rounded-2xl overflow-hidden aspect-[4/5] select-none">
            {/* Checkerboard for transparent bg */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, transparent 0% 50%)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* After image (transparent) */}
            <img src={demoAfter} alt="After" className="absolute inset-0 w-full h-full object-cover" />
            {/* Before image clipped */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={demoBefore}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
              />
            </div>
            {/* Slider line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-glow z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full gradient-primary shadow-glow flex items-center justify-center text-primary-foreground text-xs font-bold">
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
              className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
            />
            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur rounded-md px-3 py-1 text-xs font-semibold z-10">
              Before
            </div>
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur rounded-md px-3 py-1 text-xs font-semibold z-10">
              After
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
