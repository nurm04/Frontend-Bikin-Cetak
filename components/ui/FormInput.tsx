import { ReactNode } from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
}

export default function FormInput({ label, name, type = "text", placeholder, icon }: FormInputProps) {
  return (
    <div className="form-control w-full">
      <label className="label px-1">
        <span className="label-text font-bold uppercase text-[10px] opacity-60 tracking-wider">
          {label}
        </span>
      </label>
      <div className="relative mt-1">
        {icon && (
          <span className="absolute inset-y-0 left-4 flex items-center opacity-30 z-10 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={`input input-bordered w-full ${icon ? 'pl-12' : 'pl-5'} bg-base-200 focus:input-primary border-none rounded-2xl font-medium placeholder:opacity-30 text-sm`}
        />
      </div>
    </div>
  );
}