'use client';
import { useRouter } from "next/navigation";
import { PremiumPanel } from "./premiumPanel";
import { StandardPanel } from "./standardPanel";
import { useEffect, useState } from "react";
import { initFirebase } from "@/firebase";
import { getAuth } from "firebase/auth";
import { getCheckoutUrl, getPortalUrl } from "./stripePayment";
import { getPremiumStatus } from "./getPremiumStatus";
import React from 'react';
import { Button, Box } from '@mui/material';

const PaymentForm = () => {

  const upgradeToPremium = async () => {
    console.log("Nothing in this world comes free");
  };

  return (
    <Button onClick={payToUse} variant="contained" color="primary" sx={{ padding: '16px 24px', fontSize: '1.125rem', borderRadius: '12px', boxShadow: 3, '&:hover': {vbackgroundColor: 'primary.dark', },}}>
      <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        Pay $1.99 to use Flashcard Generator
      </Box>
    </Button>
  )
}

export default PaymentForm
