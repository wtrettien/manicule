import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import HomePage from 'containers/HomePage'

test('renders the home page', () => {
    render(<HomePage />, { wrapper: MemoryRouter })
    // Change this to some other word if the text content diverges significantly
    const copy = screen.getByText(/edition/i)
    expect(copy).toBeInTheDocument()
})
