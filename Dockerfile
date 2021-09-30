# Author runyanjake

# Use node
FROM node:14

# Specify Working Dir
WORKDIR /etc/chatBot

# Include deps (package & package-lock if applicable)
COPY package*.json ./

# Copy source
COPY chatBot.js ./

# Install deps
RUN npm install

# Expose on port 7080
EXPOSE 7080

# Run Server
CMD [ "node", "chatBot.js" ]