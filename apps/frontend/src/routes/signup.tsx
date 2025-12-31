import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth-client';

export const Route = createFileRoute('/signup')({
	component: SignUpForm,
});

function SignUpForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		await signUp.email(
			{
				name: formData.name,
				email: formData.email,
				password: formData.password,
			},
			{
				onSuccess: () => {
					console.log('User signed up successfully');
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
			<h1 className='text-3xl font-bold mb-6'>Sign Up</h1>
			<form onSubmit={handleSignUp} className='space-y-4'>
				<div className='space-y-2'>
					<label htmlFor='name' className='text-sm font-medium'>
						Name
					</label>
					<Input
						id='name'
						name='name'
						type='text'
						placeholder='Enter your name'
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

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
					Sign Up
				</Button>
			</form>

			<p className='text-center text-sm text-muted-foreground mt-4'>
				Already have an account?{' '}
				<Link to='/signin' className='text-primary hover:underline font-medium'>
					Sign in
				</Link>
			</p>
		</div>
	);
}
