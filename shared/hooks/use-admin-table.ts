import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  banUserSchema,
  tableStateSchema,
} from '@/features/auth/config/user.schema';
import { CreateUserInput,UpdateUserInput,DeleteUserInput,BanUserInput, TableState} from '@/core/domain/types/admin/user.type';

interface UseAdminTableProps {
  onCreateUser: (data: CreateUserInput) => Promise<void>;
  onUpdateUser: (data: UpdateUserInput) => Promise<void>;
  onDeleteUser: (data: DeleteUserInput) => Promise<void>;
  onBanUser: (data: BanUserInput) => Promise<void>;
  onTableStateChange: (state: TableState) => Promise<void>;
}

export function useAdminTable({ onCreateUser, onUpdateUser, onDeleteUser, onBanUser, onTableStateChange }: UseAdminTableProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const createForm = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const updateForm = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  const deleteForm = useForm<DeleteUserInput>({
    resolver: zodResolver(deleteUserSchema),
  });

  const banForm = useForm<BanUserInput>({
    resolver: zodResolver(banUserSchema),
  });

  const handleCreateUser = async (data: CreateUserInput) => {
    try {
      setIsLoading(true);
      await onCreateUser(data);
      createForm.reset();
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (data: UpdateUserInput) => {
    try {
      setIsLoading(true);
      await onUpdateUser(data);
      updateForm.reset();
      setSelectedUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (data: DeleteUserInput) => {
    try {
      setIsLoading(true);
      await onDeleteUser(data);
      deleteForm.reset();
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (data: BanUserInput) => {
    try {
      setIsLoading(true);
      await onBanUser(data);
      banForm.reset();
      setSelectedUser(null);
      toast.success('User banned successfully');
    } catch (error) {
      toast.error('Failed to ban user');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableStateChange = async (state: TableState) => {
    try {
      const validatedState = tableStateSchema.parse(state);
      await onTableStateChange(validatedState);
    } catch (error) {
      console.error('Invalid table state:', error);
    }
  };

  return {
    isLoading,
    selectedUser,
    setSelectedUser,
    createForm,
    updateForm,
    deleteForm,
    banForm,
    handleCreateUser: createForm.handleSubmit(handleCreateUser),
    handleUpdateUser: updateForm.handleSubmit(handleUpdateUser),
    handleDeleteUser: deleteForm.handleSubmit(handleDeleteUser),
    handleBanUser: banForm.handleSubmit(handleBanUser),
    handleTableStateChange,
  };
}
