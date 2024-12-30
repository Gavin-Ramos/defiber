## Most important files

The ```main.tsx``` file contains the logic for the main website. The ```cart.jsx``` file contains the logic to interact with the smart contract using ethers.js. The ```smartContracts``` folder contains the ```payments.sol``` file which is the smart contract that contains the logic on which the latienda site runs.

```
defiber/
├── src/
     |--app
│        ├── main.tsx
│        └── cart.jsx
├── smartContracts/
│   ├── payments.sol
│   └── abis
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
