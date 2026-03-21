package com.finance.tracker.service;

import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.TransactionRepository;
import com.finance.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public Transaction addTransaction(Transaction transaction, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByUser(user);
    }

    public Transaction updateTransaction(Long id, Transaction updated, String email) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        existing.setType(updated.getType());
        existing.setAmount(updated.getAmount());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        existing.setDate(updated.getDate());
        return transactionRepository.save(existing);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
