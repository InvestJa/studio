'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T = any>() {
  const { data: session } = useSession()
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const request = useCallback(async (url: string, options: ApiOptions = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { method = 'GET', body, headers = {} } = options

      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body)
      }

      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
      return data

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  const get = useCallback((url: string, headers?: Record<string, string>) => 
    request(url, { method: 'GET', headers }), [request])

  const post = useCallback((url: string, body?: any, headers?: Record<string, string>) => 
    request(url, { method: 'POST', body, headers }), [request])

  const put = useCallback((url: string, body?: any, headers?: Record<string, string>) => 
    request(url, { method: 'PUT', body, headers }), [request])

  const del = useCallback((url: string, headers?: Record<string, string>) => 
    request(url, { method: 'DELETE', headers }), [request])

  return {
    ...state,
    request,
    get,
    post,
    put,
    delete: del,
  }
}

// Specialized hooks for common operations
export function useClients() {
  const api = useApi()

  const fetchClients = useCallback(() => api.get('/api/clients'), [api])
  const createClient = useCallback((data: any) => api.post('/api/clients', data), [api])
  const updateClient = useCallback((id: string, data: any) => api.put(`/api/clients/${id}`, data), [api])
  const deleteClient = useCallback((id: string) => api.delete(`/api/clients/${id}`), [api])

  return {
    ...api,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
}

export function usePayments() {
  const api = useApi()

  const fetchPayments = useCallback(() => api.get('/api/payments'), [api])
  const createPayment = useCallback((data: any) => api.post('/api/payments', data), [api])
  const updatePayment = useCallback((id: string, data: any) => api.put(`/api/payments/${id}`, data), [api])

  return {
    ...api,
    fetchPayments,
    createPayment,
    updatePayment,
  }
}

export function useDashboard() {
  const api = useApi()

  const fetchDashboardData = useCallback(() => api.get('/api/dashboard'), [api])

  return {
    ...api,
    fetchDashboardData,
  }
}