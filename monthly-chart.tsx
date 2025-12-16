'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Transaction } from '@/app/page'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MonthlyChartProps {
  transactions: Transaction[]
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  // Agrupar transações por mês
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date + 'T00:00:00')
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, receitas: 0, despesas: 0 }
    }
    
    if (transaction.type === 'receita') {
      acc[monthYear].receitas += transaction.amount
    } else {
      acc[monthYear].despesas += transaction.amount
    }
    
    return acc
  }, {} as Record<string, { month: string; receitas: number; despesas: number }>)

  const chartData = Object.values(monthlyData)
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split('/').map(Number)
      const [monthB, yearB] = b.month.split('/').map(Number)
      return yearA !== yearB ? yearA - yearB : monthA - monthB
    })
    .slice(-6) // Últimos 6 meses

  const formatMonth = (monthYear: string) => {
    const [month, year] = monthYear.split('/')
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${monthNames[parseInt(month) - 1]}/${year.slice(-2)}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  if (chartData.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Gráfico Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Dados insuficientes para gerar o gráfico. <br />
            Adicione algumas transações para visualizar o resumo mensal.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Receitas x Despesas (Mensal)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                tickFormatter={formatMonth}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={formatMonth}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="receitas" 
                name="Receitas" 
                fill="hsl(var(--success))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dat
