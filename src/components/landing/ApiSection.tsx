import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";

const codeSnippet = `curl -X POST https://api.snapcutai.com/v1/remove-bg \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -o result.png`;

const ApiSection = () => {
  return (
    <section id="api" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-4">
              <Code size={16} />
              Developer API
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Integrate in Minutes
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Add background removal to your apps with a simple REST API. Get your API key and start building.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">Get API Key</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <span className="h-3 w-3 rounded-full bg-destructive/60" />
                <span className="h-3 w-3 rounded-full bg-secondary/60" />
                <span className="h-3 w-3 rounded-full bg-primary/60" />
                <span className="text-xs text-muted-foreground ml-2">Terminal</span>
              </div>
              <pre className="p-6 text-sm text-secondary font-mono overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ApiSection;
