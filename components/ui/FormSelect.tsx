interface FormSelectProps {
  label: string;
  name: string;
  options: string[];
}

export default function FormSelect({ label, name, options }: FormSelectProps) {
  return (
    <div className="form-control w-full">
      <label className="label px-1">
        <span className="label-text font-bold uppercase text-[10px] opacity-60 tracking-wider">
          {label}
        </span>
      </label>
      <select 
        name={name}
        defaultValue={`Pilih ${label}`}
        className="select mt-1 w-full bg-base-200 border-none rounded-2xl font-medium text-sm px-5 transition-all focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
      >
        <option disabled>Pilih {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}