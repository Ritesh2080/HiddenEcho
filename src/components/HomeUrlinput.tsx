"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const HomeUrlinput = () => {
     const [url, setUrl] = useState("");
      const isValidUserUrl = (inputUrl: string) => {
    try {
      const parsedUrl = new URL(inputUrl);
      // Check if pathname matches `/u/<something>`
      return /^\/u\/[A-Za-z0-9_-]+$/.test(parsedUrl.pathname);
    } catch {
      return false;
    }
  };
    const urlButtonClick = () => {
    if (!url) {
      toast.error("Please enter a URL.");
      return;
    }

    if (!isValidUserUrl(url)) {
      toast.error("Invalid URL format. Please enter a valid user URL.");
      return;
    }

    window.location.href = url;
  };
  return (
    <div className="input-group flex justify-center gap-2 flex-col md:flex-row items-center mt-4 w-full md:w-[80%]">
             <input
             aria-label="User URL"
            type="text"
            value={url}
            placeholder="Enter the URL of the person you want to send a message to"
            onChange={(e) => setUrl(e.target.value)}
            className="w-full md:w-[50%] text-xs md:text-base p-2 !border-1 !border-white !rounded-md !text-white"
          />
                    <Button variant='ghost' className="text-white md:text-base text-sm w-auto border-1 hover:bg-white/20 md:p-5 p-3" onClick={urlButtonClick}>GO</Button>

          </div>
  )
}

export default HomeUrlinput




