const error = (err, req, res, next) => {
  if (err) {
    const { message } = err;
    res.status(500).json({ message });
  }
  next();
};

export default { error };
