package com.finance.tracker.controller;

import com.finance.tracker.model.Transaction;
import com.finance.tracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Add transaction
    @PostMapping
    public ResponseEntity<Transaction> add(@RequestBody Transaction transaction,
                                           Principal principal) {
        return ResponseEntity.ok(
            transactionService.addTransaction(transaction, principal.getName())
        );
    }

    // Get all transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getAll(Principal principal) {
        return ResponseEntity.ok(
            transactionService.getAllTransactions(principal.getName())
        );
    }

    // Update transaction
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(@PathVariable Long id,
                                               @RequestBody Transaction transaction,
                                               Principal principal) {
        return ResponseEntity.ok(
            transactionService.updateTransaction(id, transaction, principal.getName())
        );
    }

    // Delete transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Transaction deleted");
    }
}