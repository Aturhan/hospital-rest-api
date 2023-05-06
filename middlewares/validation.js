const validatePassword = (password) =>{
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!regex.test(value)) {
      throw new Error('Password must contain at least one letter and one number');
    }
  }

module.exports = validatePassword