import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { Link } from './link';
import { ButtonConnection } from './button';
import { useSession, signOut } from '@/lib/auth-client';

export const Header = () => {
	const { data: session } = useSession();
	const navigate = useNavigate();

	const handleSignOut = async (e: React.FormEvent) => {
		e.preventDefault();
		await signOut();
		navigate({ to: '/signin' });
	};

	if (!session) {
		return (
			<header className='flex items-center justify-between gap-4 px-4 py-2 border border-b'>
				<Link to='/'>App</Link>
				<div className='flex-1'></div>
				<ButtonConnection>
					<Link to='/signup'>Sign up</Link>
				</ButtonConnection>
			</header>
		);
	}
	return (
		<header className='flex items-center justify-between gap-4 px-4 py-2 border border-b'>
			<Link to='/'>App</Link>
			<div className='flex-1'></div>
			<form onSubmit={handleSignOut}>
				<ButtonConnection>
					<LogOut className='size-4' />
					<span className='font-medium text-sm'>Logout</span>
				</ButtonConnection>
			</form>
		</header>
	);
};
