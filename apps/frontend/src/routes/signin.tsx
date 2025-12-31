import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';

export const Route = createFileRoute('/signin')({
	component: SignInForm,
});

function SignInForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signIn.email(
			{
				email: formData.email,
				password: formData.password,
			},
			{
				onSuccess: () => {
					console.log('User signed in successfully');
					navigate({ to: '/' });
				},
				onError: (error) => {
					alert(`Error: ${error.error.message}`);
				},
			},
		);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className='container mx-auto max-w-md p-8'>
			<h1 className='text-3xl font-bold mb-6'>Sign In</h1>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='space-y-2'>
					<label htmlFor='email' className='text-sm font-medium'>
						Email
					</label>
					<Input
						id='email'
						name='email'
						type='email'
						placeholder='Enter your email'
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='space-y-2'>
					<label htmlFor='password' className='text-sm font-medium'>
						Password
					</label>
					<Input
						id='password'
						name='password'
						type='password'
						placeholder='Enter your password'
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>

				<Button type='submit' className='w-full'>
					Sign In
				</Button>
			</form>

			<p className='text-center text-sm text-muted-foreground mt-4'>
				Don't have an account?{' '}
				<Link to='/signup' className='text-primary hover:underline font-medium'>
					Sign up
				</Link>
			</p>
		</div>
	);
}
