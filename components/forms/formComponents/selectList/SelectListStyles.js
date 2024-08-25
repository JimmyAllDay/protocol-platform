export const selectListStyles = (theme) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? 'bg-primary' : 'bg-primaryDark',
    borderWidth: '1px',
    borderColor: theme === 'dark' ? 'border-black' : 'border-white',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.5)' : 'none', // Tailwind ring-blue-500 equivalent
    '&:hover': {
      borderColor: theme === 'dark' ? '#9ca3af' : '#4b5563', // border-gray-500 for light, border-gray-700 for dark
    },
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '0.5rem 1rem', // py-2 px-4
    cursor: 'pointer',
    backgroundColor: state.isSelected
      ? theme === 'dark'
        ? '#2563eb' // bg-blue-500
        : '#3b82f6' // bg-blue-400
      : theme === 'dark'
      ? '#1f2937' // bg-gray-800
      : '#ffffff', // bg-white
    color: state.isSelected
      ? '#ffffff'
      : theme === 'dark'
      ? '#d1d5db'
      : '#000000', // Adjust text color based on theme and selection
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? 'bg-primaryDark' : 'bg-primary', // bg-gray-800 for dark, bg-white for light
    boxShadow:
      '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-lg
    borderRadius: '0.375rem', // rounded-md
    overflow: 'auto',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#d1d5db' : '#000000', // Adjust selected text color based on theme
  }),
});
