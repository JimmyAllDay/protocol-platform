export const selectListStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '',
    borderRadius: '0.375rem', // Equivalent to rounded-lg
    borderWidth: '1px',
    borderColor: '', // Equivalent to border-gray-300
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Similar to shadow-sm
    '&:hover': {
      borderColor: '#9ca3af', // On hover, use a different border color
    },
    '&:focus': {
      outline: '2px solid transparent',
      outlineOffset: '2px',
      ringWidth: '2px',
      ringColor: '#2563eb', // Focus ring color equivalent to ring-blue-500
    },
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '0.5rem 1rem', // py-2 px-4
    cursor: 'pointer',
    backgroundColor: state.isSelected ? 'blue' : 'white',
    color: state.isSelected ? 'white' : 'black',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    boxShadow:
      '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-lg
    borderRadius: '0.375rem', // rounded-md
    overflow: 'auto',
  }),
  // Add other component styles as needed
};
