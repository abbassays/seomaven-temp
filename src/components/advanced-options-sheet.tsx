import { Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { OnPageParameters } from "@/types/dataforseo";

interface AdvancedOptionsSheetProps {
  parameters: OnPageParameters;
  onParametersChange: (parameters: OnPageParameters) => void;
}

export function AdvancedOptionsSheet({
  parameters,
  onParametersChange,
}: AdvancedOptionsSheetProps) {
  const handleToggle = (key: keyof OnPageParameters) => {
    onParametersChange({
      ...parameters,
      [key]: !parameters[key as keyof OnPageParameters],
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Advanced Options</DialogTitle>
          <DialogDescription>
            Configure additional parameters for the SEO analysis
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="store_raw_html">Store Raw HTML</Label>
              <input
                type="checkbox"
                id="store_raw_html"
                checked={parameters.store_raw_html}
                onChange={() => handleToggle("store_raw_html")}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="load_resources">Load Resources</Label>
              <input
                type="checkbox"
                id="load_resources"
                checked={parameters.load_resources}
                onChange={() => handleToggle("load_resources")}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable_javascript">Enable JavaScript</Label>
              <input
                type="checkbox"
                id="enable_javascript"
                checked={parameters.enable_javascript}
                onChange={() => handleToggle("enable_javascript")}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable_browser_rendering">
                Enable Browser Rendering
              </Label>
              <input
                type="checkbox"
                id="enable_browser_rendering"
                checked={parameters.enable_browser_rendering}
                onChange={() => handleToggle("enable_browser_rendering")}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="calculate_keyword_density">
                Calculate Keyword Density
              </Label>
              <input
                type="checkbox"
                id="calculate_keyword_density"
                checked={parameters.calculate_keyword_density}
                onChange={() => handleToggle("calculate_keyword_density")}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="max_pages">Max Pages</Label>
              <input
                type="number"
                id="max_pages"
                value={parameters.max_crawl_pages}
                onChange={(e) =>
                  onParametersChange({
                    ...parameters,
                    max_crawl_pages: parseInt(e.target.value) || undefined,
                  })
                }
                className="w-20 px-2 py-1 border rounded"
                min="1"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
