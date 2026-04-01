/**
 * MetricInput.jsx
 * Reusable animated input field for the predictor form.
 * Accepts label, id, type, value, onChange, and additional props.
 */
export default function MetricInput({ label, id, icon, children, ...props }) {
  const isSelect = props.as === 'select';

  return (
    <div className="flex flex-col gap-1.5 group">
      {/* Label */}
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
      >
        {icon && <span className="text-base">{icon}</span>}
        {label}
      </label>

      {/* Input or Select */}
      {isSelect ? (
        <select
          id={id}
          className="
            bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-100
            outline-none transition-all duration-200
            focus:border-primary focus:ring-2 focus:ring-primary/30
            hover:border-white/20 cursor-pointer
          "
          {...props}
          as={undefined}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          className="
            bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-100
            outline-none transition-all duration-200
            focus:border-primary focus:ring-2 focus:ring-primary/30
            hover:border-white/20 placeholder-slate-600
          "
          {...props}
        />
      )}
    </div>
  );
}
