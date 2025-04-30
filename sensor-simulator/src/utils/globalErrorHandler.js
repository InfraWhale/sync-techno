function registerGlobalErrorHandlers() {
    process.on('uncaughtException', (err) => {
      console.error('[Uncaught Exception]');
      console.error('message:', err.message);
      console.error('stack:', err.stack);
    });
  
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Unhandled Rejection]');
      console.error('reason:', reason);
      console.error('promise:', promise);
    });
  }
  
  module.exports = { registerGlobalErrorHandlers };