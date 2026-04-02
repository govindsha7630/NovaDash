function Logo() {
  return (
    <div className="h-full w-full border-2 border-amber-400">
      <div className="flex items-center justify-center gap-3 ">
        <div
          className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl
                                        flex items-center justify-center"
        >
          <div
            className="w-0 h-0
                                border-l-[8px] border-l-transparent
                                border-r-[8px] border-r-transparent
                                border-b-[14px] border-b-white"
          />
        </div>
        <span className="text-3xl font-bold text-white">NovaDash</span>
      </div>
    </div>
  );
}

export default Logo;
