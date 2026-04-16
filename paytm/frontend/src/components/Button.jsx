
export function Button({label, onClick}) {
    
    return <button onClick={onClick} type="button" class="w-full text-white bg-gray-800 box-border border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">{label}</button>
}
