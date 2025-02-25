import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Building2, MapPin, Wallet, User } from 'lucide-react';

const RoleManagement = () => {
    const { contract, account, role } = useWeb3();
    const [owner, setOwner] = useState('');
    const [newRole, setNewRole] = useState({
        address: '',
        name: '',
        location: '',
        role: 'Farmer'
    });

    useEffect(() => {
        const debugOwnership = async () => {
            if (contract && account) {
                try {
                    const owner = await contract.methods.Owner().call();
                    console.log('Debug ownership:', {
                        owner: owner.toLowerCase(),
                        currentAccount: account.toLowerCase(),
                        isOwner: owner.toLowerCase() === account.toLowerCase(),
                        role
                    });
                } catch (error) {
                    console.error('Error checking ownership:', error);
                }
            }
        };
        debugOwnership();
    }, [contract, account]);

    useEffect(() => {
        const getOwner = async () => {
            if (contract) {
                try {
                    const ownerAddress = await contract.methods.Owner().call();
                    setOwner(ownerAddress);
                } catch (error) {
                    console.error('Error fetching owner:', error);
                }
            }
        };
        getOwner();
    }, [contract]);

    const assignRole = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!contract || !account) {
            toast.error('Please connect your wallet');
            return;
        }

        try {
            let method;
            switch (newRole.role) {
                case 'Farmer':
                    method = contract.methods.addFarmer(newRole.address, newRole.name, newRole.location);
                    break;
                case 'Processor':
                    method = contract.methods.addProcessor(newRole.address, newRole.name, newRole.location);
                    break;
                case 'Distributor':
                    method = contract.methods.addDistributor(newRole.address, newRole.name, newRole.location);
                    break;
                case 'Retailer':
                    method = contract.methods.addRetailer(newRole.address, newRole.name, newRole.location);
                    break;
                default:
                    throw new Error('Invalid role selected');
            }

            await toast.promise(
                method.send({ from: account }),
                {
                    loading: `Assigning ${newRole.role} role...`,
                    success: `Successfully assigned ${newRole.role} role`,
                    error: 'Failed to assign role'
                }
            );

            // Clear form after successful assignment
            setNewRole({
                address: '',
                name: '',
                location: '',
                role: 'Farmer'
            });
        } catch (error) {
            console.error('Error assigning role:', error);
            toast.error('Failed to assign role');
        }
    };

    // Only show the component if the connected account is not the owner
    if (role !== 'owner') {
        return (
            <div className="container mx-auto p-4">
                <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-50 to-white">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="rounded-full bg-slate-100 w-16 h-16 mx-auto flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-800">Access Restricted</h3>
                                <p className="text-slate-600">Only the owner can manage roles.</p>
                                {owner && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-sm text-slate-500">Owner Address</p>
                                        <code className="text-xs bg-white px-2 py-1 rounded mt-1 block overflow-auto">
                                            {owner}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-50 to-white">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Manage Roles
                    </CardTitle>
                    <CardDescription>
                        Assign roles to participants in the supply chain network
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={assignRole} className="space-y-6">
                        <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-500" />
                                    Role Type
                                </Label>
                                <Select 
                                    value={newRole.role}
                                    onValueChange={(value) => setNewRole({ ...newRole, role: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Farmer">Farmer</SelectItem>
                                        <SelectItem value="Processor">Processor</SelectItem>
                                        <SelectItem value="Distributor">Distributor</SelectItem>
                                        <SelectItem value="Retailer">Retailer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-slate-500" />
                                    Wallet Address
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="0x..."
                                    value={newRole.address}
                                    onChange={(e) => setNewRole({ ...newRole, address: e.target.value })}
                                    required
                                    className="font-mono text-sm"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-500" />
                                    Participant Name
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Enter participant name"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    Location
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Enter location"
                                    value={newRole.location}
                                    onChange={(e) => setNewRole({ ...newRole, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm"
                        >
                            Assign Role
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleManagement;