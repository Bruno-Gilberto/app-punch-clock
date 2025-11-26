// Formatar CPF
const formatCPF = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// Formatar CEP
const formatCEP = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
};

export { formatCPF, formatCEP };