DROP TRIGGER IF EXISTS update_operacao_TOM_dados;
DROP TRIGGER IF EXISTS update_operacao_TOM_nominal;
DROP TRIGGER IF EXISTS update_operacao_TOM_rev;
DROP TRIGGER IF EXISTS update_operacao_TOM_dureza;
DROP TRIGGER IF EXISTS update_operacao_TOM_oil;


-- Atualizar TOM da Operacao quando Dados for atualizado
CREATE TRIGGER update_operacao_TOM_dados
AFTER UPDATE ON Dados
FOR EACH ROW
BEGIN
    UPDATE Operacao 
    SET TOM = datetime(CURRENT_TIMESTAMP, '-3 hours')
    WHERE id = OLD.operacaoId;
END;

-- Atualizar TOM da Operacao quando Nominal for atualizado
CREATE TRIGGER update_operacao_TOM_nominal
AFTER UPDATE ON Nominal
FOR EACH ROW
BEGIN
    UPDATE Operacao 
    SET TOM = datetime(CURRENT_TIMESTAMP, '-3 hours')
    WHERE id = OLD.operacaoId;
END;

-- Atualizar TOM da Operacao quando Rev for atualizado
CREATE TRIGGER update_operacao_TOM_rev
AFTER UPDATE ON Rev
FOR EACH ROW
BEGIN
    UPDATE Operacao 
    SET TOM = datetime(CURRENT_TIMESTAMP, '-3 hours')
    WHERE id = OLD.operacaoId;
END;

-- Atualizar TOM da Operacao quando Dureza for atualizado
CREATE TRIGGER update_operacao_TOM_dureza
AFTER UPDATE ON Dureza
FOR EACH ROW
BEGIN
    UPDATE Operacao 
    SET TOM = datetime(CURRENT_TIMESTAMP, '-3 hours')
    WHERE id = OLD.operacaoId;
END;

-- Atualizar TOM da Operacao quando Oil for atualizado
CREATE TRIGGER update_operacao_TOM_oil
AFTER UPDATE ON Oil
FOR EACH ROW
BEGIN
    UPDATE Operacao 
    SET TOM = datetime(CURRENT_TIMESTAMP, '-3 hours')
    WHERE id = OLD.operacaoId;
END;
