export const FounderCredit = () => {
  return (
    <div className="mt-6 flex justify-center">
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 px-4 py-3 opacity-90">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <img
            src="https://ik.imagekit.io/aamir010/Bin%20hashim%20E%20commerce/Aamir%20Professtional.jpg"
            alt="Aamir Khan"
            className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0 flex-1 text-left">
            <a
              href="https://www.linkedin.com/in/vasmo-aamir"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block"
            >
              <div
                className="text-lg text-white group-hover:underline underline-offset-4"
                style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive' }}
              >
                Aamir Khan
              </div>
            </a>
            <div className="text-xs sm:text-sm text-white/80">
              Founder — Aamir.ai1 (Software &amp; AI Development)
            </div>
            <div className="mt-1 text-[11px] sm:text-xs text-white/55 leading-relaxed">
              Full-Stack Developer · AI Engineer · Machine Learning · System Design
            </div>
            <a
              href="https://www.linkedin.com/in/vasmo-aamir"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center rounded-full border border-white/15 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/85 hover:text-white hover:border-white/25"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
