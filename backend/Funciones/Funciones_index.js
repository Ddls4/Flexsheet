import bcrypt from "bcrypt";

const Encriptar = async (password)=> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword
}

export {
    Encriptar
}