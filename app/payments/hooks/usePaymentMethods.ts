import {useState} from 'react';
import {PaymentMethod, Provider, PaymentTab} from '../types';
import {CreditCard, Banknote, Wallet, Building2, DollarSign} from 'lucide-react';

const mockMethods: PaymentMethod[] = [
    {
        id: 'credit_cards',
        name: 'Credit Cards',
        icon: CreditCard,
        status: 'active',
        category: 'credit_card',
        availableIn: ['topup', 'checkout'],
        fees: {
            topup: {percentage: 2.5, fixed: 0.3, paidBy: 'user'},
            checkout: {percentage: 2.0, fixed: 0.2, paidBy: 'merchant'}
        },
        processingTime: 'Instant',
        providers: [
            {
                id: 'visa',
                name: 'Visa',
                status: 'active',
                fees: {
                    topup: {percentage: 2.5, fixed: 0.3},
                    checkout: {percentage: 2.0, fixed: 0.2}
                },
                processingTime: 'Instant'
            },
            {
                id: 'mastercard',
                name: 'Mastercard',
                status: 'inactive',
                fees: {
                    topup: {percentage: 2.7, fixed: 0.35},
                    checkout: {percentage: 2.1, fixed: 0.25}
                },
                processingTime: 'Instant'
            }
        ]
    },
    {
        id: 'cash_pickup',
        name: 'Cash Pickup',
        icon: Banknote,
        status: 'inactive',
        category: 'cash_pickup',
        availableIn: ['topup'],
        fees: {
            topup: {fixed: 1.0, paidBy: 'user'},
            checkout: {}
        },
        processingTime: '10-30 min',
        providers: [
            {
                id: 'western_union',
                name: 'Western Union',
                status: 'active',
                fees: {
                    topup: {fixed: 1.0},
                    checkout: {}
                },
                processingTime: '10-30 min'
            }
        ]
    },
    {
        id: 'digital_wallets',
        name: 'In Person',
        icon: Building2,
        status: 'active',
        category: 'digital_wallet',
        availableIn: ['topup', 'checkout'],
        fees: {
            topup: {percentage: 1.5, paidBy: 'user'},
            checkout: {percentage: 1.0, paidBy: 'merchant'}
        },
        processingTime: 'Instant',
        providers: [
            {
                id: 'paypal',
                name: 'PayPal',
                status: 'active',
                fees: {
                    topup: {percentage: 1.5},
                    checkout: {percentage: 1.0}
                },
                processingTime: 'Instant'
            }
        ]
    },
    {
        id: 'office',
        name: 'e-Transfer',
        icon: DollarSign,
        status: 'inactive',
        category: 'office',
        availableIn: ['topup'],
        fees: {
            topup: {fixed: 0, paidBy: 'user'},
            checkout: {}
        },
        processingTime: 'During office hours',
        providers: [
            {
                id: 'main_office',
                name: 'Main Office',
                status: 'active',
                fees: {
                    topup: {fixed: 0},
                    checkout: {}
                },
                processingTime: 'During office hours',
                coordinates: [{address: '123 Main St, City'}]
            }
        ]
    }
];

export function usePaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockMethods);
    const [configurationModal, setConfigurationModal] = useState({isOpen: false, item: null as null | PaymentMethod});
    const [saveNotification, setSaveNotification] = useState({isVisible: false, message: ''});

    const toggleMethodStatus = (id: string) => {
        setPaymentMethods((prev) =>
            prev.map((m) =>
                m.id === id ? {...m, status: m.status === 'active' ? 'inactive' : 'active'} : m
            )
        );
    };

    const toggleProviderStatus = (methodId: string, providerId: string) => {
        setPaymentMethods((prev) =>
            prev.map((m) =>
                m.id === methodId
                    ? {
                        ...m,
                        providers: m.providers?.map((p) =>
                            p.id === providerId ? {...p, status: p.status === 'active' ? 'inactive' : 'active'} : p
                        )
                    }
                    : m
            )
        );
    };

    const configureMethod = (id: string) => {
        const item = paymentMethods.find((m) => m.id === id) || null;
        setConfigurationModal({isOpen: true, item});
    };

    const closeConfigurationModal = () => setConfigurationModal({isOpen: false, item: null});

    const saveConfiguration = (item: PaymentMethod) => {
        setPaymentMethods((prev) =>
            prev.map((m) => (m.id === item.id ? {...m, ...item} : m))
        );
        setConfigurationModal({isOpen: false, item: null});
        setSaveNotification({isVisible: true, message: 'Payment method updated successfully!'});
    };

    const hideSaveNotification = () => setSaveNotification({isVisible: false, message: ''});

    return {
        paymentMethods,
        toggleMethodStatus,
        toggleProviderStatus,
        configureMethod,
        configurationModal,
        closeConfigurationModal,
        saveConfiguration,
        saveNotification,
        hideSaveNotification
    };
} 