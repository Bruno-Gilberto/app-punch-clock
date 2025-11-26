// Validar CPF
const validateCPF = (cpf, setCpfError) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) {
        setCpfError('CPF deve conter 11 dígitos');
        return false;
    }
    
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
        setCpfError('CPF inválido');
        return false;
    }
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
        setCpfError('CPF inválido');
        return false;
    }
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
        setCpfError('CPF inválido');
        return false;
    }
    
    setCpfError('');
    return true;
};

export { validateCPF };