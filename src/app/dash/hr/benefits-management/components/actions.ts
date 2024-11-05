'use server'

import { mockEmployees, mockSalaries, mockSalaryHistory, mockBenefits } from './mock-data'
import { Salary, SalaryHistory, Benefit } from '@prisma/client'

export async function getEmployees() {
  return mockEmployees
}

export async function getSalary(employeeId: string) {
  return mockSalaries[employeeId] || null
}

export async function updateSalary(employeeId: string, salaryData: Partial<Salary>) {
  mockSalaries[employeeId] = { ...mockSalaries[employeeId], ...salaryData }
  return mockSalaries[employeeId]
}

export async function getSalaryHistory(employeeId: string) {
  return mockSalaryHistory[employeeId] || []
}

export async function addSalaryHistory(employeeId: string, salaryHistoryData: Partial<SalaryHistory>) {
  const newSalaryHistory = {
    id: Date.now().toString(),
    employeeId,
    ...salaryHistoryData,
  } as SalaryHistory
  mockSalaryHistory[employeeId] = [newSalaryHistory, ...(mockSalaryHistory[employeeId] || [])]
  return newSalaryHistory
}

export async function getBenefits(employeeId: string) {
  return mockBenefits[employeeId] || []
}

export async function addBenefit(employeeId: string, benefitData: Partial<Benefit>) {
  const newBenefit = {
    id: Date.now().toString(),
    employeeId,
    ...benefitData,
  } as Benefit
  mockBenefits[employeeId] = [newBenefit, ...(mockBenefits[employeeId] || [])]
  return newBenefit
}