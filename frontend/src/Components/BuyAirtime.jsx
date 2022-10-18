import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
} from '@chakra-ui/react';

import { Illustration } from './Hero.jsx';
import { Radio, RadioGroup } from '@chakra-ui/react'


export default function BuyAirTime() {
    return (
        <Box position={'relative'}>
            <Container
                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>
                <Stack spacing={{ base: 10, md: 20 }}>

                    <Flex w={'full'}>
                        <Illustration
                            height={{ sm: '24rem', lg: '28rem' }}
                            mt={{ base: 12, sm: 16 }}
                        />
                    </Flex>


                </Stack>
                <Stack
                    bg={'gray.50'}
                    rounded={'xl'}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 8 }}
                    maxW={{ lg: 'lg' }}>
                    <Stack spacing={4}>
                        <Heading
                            color={'gray.800'}
                            lineHeight={1.1}
                            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                            Buy Airtime
                <Text
                                as={'span'}
                                bgGradient="linear(to-r, red.400,pink.400)"
                                bgClip="text">
                                !
                </Text>
                        </Heading>
                        {/* put and illustrator here */}
                    </Stack>
                    <Box as={'form'} mt={10}>
                        <Stack spacing={4}>

                            <RadioGroup>
                                <Stack direction='row'>
                                    <Radio value='1'>Econet</Radio>
                                    <Radio value='2'>Telecel</Radio>
                                    <Radio value='3'>Netone</Radio>
                                </Stack>
                            </RadioGroup>

                            <Input
                                placeholder="Your Mobile Number"
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                            />
                            <Input
                                placeholder="Phone Number to pay transaction"
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                            />
                            <Input
                                placeholder="Amount minimun.... $500.00"
                                bg={'gray.100'}
                                border={0}
                                color={'gray.500'}
                                _placeholder={{
                                    color: 'gray.500',
                                }}
                            />

                        </Stack>
                        <Button
                            fontFamily={'heading'}
                            mt={8}
                            w={'full'}
                            bgGradient="linear(to-r, green.400,green.300)"
                            color={'white'}
                            _hover={{
                                bgGradient: 'linear(to-r, green.600,green.400)',
                                boxShadow: 'xl',
                            }}>
                            Pay
              </Button>
                    </Box>
            form
          </Stack>
            </Container>

        </Box>
    );
}

