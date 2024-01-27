import { API_ROOT, DEFAULT_CHAIN_ID } from '@/constants'
import { useSDK } from '@metamask/sdk-react'
import { Order } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { createContext, useEffect, useState } from 'react'
import { useAuth } from './useAuth'

export const ORDERS_CACHE_KEY_CLIENT = 'defiber-orders-client'
const url = `${API_ROOT}/api/orders/getClientOrders` 

export const useOrdersClient = () => {
  const { account, signature } = useAuth()

  // Debounce updates to the query
  const { data, isLoading, error} = useQuery<Order[]>({
    queryKey: [ORDERS_CACHE_KEY_CLIENT, account],
    queryFn: async () => {
      if (!account) {
        return []
      }

      const response = await fetch(url, {
        headers: {
          'X-Account': account!,
          'X-Signature': signature!
        }
      })

      const responseData = await response.json()
      return responseData.orders
    },
  })

  return {
    ordersClient: data,
    isLoading,
    error
  }
}
