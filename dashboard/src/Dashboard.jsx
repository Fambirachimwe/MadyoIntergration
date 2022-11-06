import React from 'react'
import { AppShell, Navbar, Header } from '@mantine/core';
import DashHeader from './DashHeader';


function Dashboard() {
    return (
        <AppShell
            padding="md"
            navbar={<Navbar width={{ base: 300 }} height={500} p="xs">Nav Bae content here</Navbar>}
            header={<DashHeader />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            Application here
        </AppShell>
    );
}

export default Dashboard
