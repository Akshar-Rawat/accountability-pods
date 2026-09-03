let io = null;

export const setSocketIO = (socketIO) => {
  io = socketIO;
};

export const getSocketIO = () => {
  return io;
};
