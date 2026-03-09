import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-center"
      duration={2000}
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[#050508]/90 backdrop-blur-3xl text-white border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-2xl p-4 flex gap-3 items-center w-full !z-[999999]",
          description: "text-white/50 text-[13px] font-medium",
          actionButton: "bg-[#60a5fa] text-white font-black uppercase tracking-widest text-[10px] rounded-lg px-3 py-1.5",
          cancelButton: "bg-white/10 text-white/70 font-black uppercase tracking-widest text-[10px] rounded-lg px-3 py-1.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
