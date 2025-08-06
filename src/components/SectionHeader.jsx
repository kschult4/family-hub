export default function SectionHeader({ title, rightSlot = null, className = "" }) {
  return (
    <div className={`flex justify-between items-center mb-block ${className}`}>
      <h2 className="text-[36px] font-serif text-[#5A3210]">{title}</h2>
      {rightSlot && <div>{rightSlot}</div>}
    </div>
  );
}
