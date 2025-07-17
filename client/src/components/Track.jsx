const Track = ({ index, item, size }) => {
  return (
    <li className="w-full max-w-3xl flex items-center gap-6 p-4 bg-gradient-to-br from-emerald-700/40 to-black/30 rounded-2xl shadow-md backdrop-blur-sm hover:scale-105 transition-transform duration-200">
      <img src={item.album.images[0]?.url} alt={item.name} width={size} className="rounded-lg shadow" />
      <div>
        <p className="text-white font-semibold text-xl">{index}. {item.name}</p>
      </div>
    </li>
  );
};

export default Track;
