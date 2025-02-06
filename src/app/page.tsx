"use client";
import { useEffect } from "react";
import { client } from "./client";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import {
  ConnectButton,
  TransactionButton,
  useSendAndConfirmTransaction
} from "thirdweb/react";

export default function Home() {
  const { mutate: sendAndConfirmTx, data: transactionReceipt, isPending } = useSendAndConfirmTransaction();
  const contract = getContract({
    chain: defineChain(56),
    client,
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
  })
  let txFinal = prepareContractCall({
    contract,
    method: "function transfer(address to, uint256 amount) public returns (bool)",
    params: ["0x6f76231fc960f32a8edda5f156d3e0d863610ffe", toWei('0.001')],
  })
  async function send() {
    await sendAndConfirmTx(txFinal);
  }

  useEffect(() => {
    if (!isPending && transactionReceipt) {
      console.log(transactionReceipt);
    }
  }, [isPending, transactionReceipt]);



  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold mb-4">Wallet Connection</h1>

      <div className="flex flex-col items-center gap-4">
        <ConnectButton
          client={client}
          chain={defineChain(56)}
        />
        <TransactionButton
          transaction={async () => {
            return txFinal

          }}
          onTransactionSent={(result) => {
            console.log("Transaction submitted", result.transactionHash);
          }}
          onTransactionConfirmed={(receipt) => {
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onError={(error) => {
            console.error("Transaction error", error);
          }}
        >
          Confirm Transaction
        </TransactionButton>
        <button onClick={send}>TEST</button>
      </div>
    </main>
  );
}