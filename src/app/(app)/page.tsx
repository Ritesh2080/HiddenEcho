"use client";

import TextType from "@/components/TypeText";
import Carousel from "@/components/Caraousel";
import ScrambledText from "@/components/ScrambleTest";
import Galaxy from "@/components/Galaxy";
import HomeUrlinput from "@/components/HomeUrlinput";

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col relative items-center justify-center px-4 md:px-24 py-12 bg-black text-white">
        {/* <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            zIndex: "0",
          }}
        >
          <Particles
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div> */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            zIndex: "0",
          }}
        >
          <Galaxy
            glowIntensity={0.4}
            saturation={1}
            density={0.3}
            starSpeed={0.2}
          />
        </div>
        <section className="w-full flex flex-col items-center justify-center mb-4 mt-2 md:mb-12 relative z-10 pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold text-center">
            <TextType
              text={["Dive into the World of Anonymous Feedback"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h1>
          <ScrambledText
            className="mt-3 md:mt-6 p-4 md:p-0 text-center text-xs md:text-2xl pointer-events-auto"
            radius={100}
            duration={1.2}
            speed={0.5}
            scrambleChars={".:"}
          >
            HiddenEcho - Where your identity remains a secret
          </ScrambledText>
        </section>

        {/* Carousel for Messages */}

        <div style={{ height: "100%", position: "relative" }}>
          <Carousel
            baseWidth={320}
            autoplay={true}
            autoplayDelay={1500}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </div>
        <div className="w-full flex flex-col items-center justify-center mt-8 relative z-10">
          <h2 className="text-lg">Enter the URL to start Messaging</h2>
          <HomeUrlinput />
        </div>
      </main>
    </>
  );
}
